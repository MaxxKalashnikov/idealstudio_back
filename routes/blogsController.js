const express = require('express')
const { query } = require('../helpers/db.js')
const blogsRouter = express.Router()

// get all posts
blogsRouter.get('/posts', async (req, res) => {
    try {
        const result = await query('SELECT p.post_id, p.content, p.title, p.post_created_time, p.image_url, u.username AS author FROM post p INNER JOIN user_account u ON p.author_id=u.user_account_id')
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// get post by id
blogsRouter.get('/posts/:post_id', async (req, res) => {
    try {
        const result = await query('select * from post where post_id=($1)', 
        [req.params.post_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// add new post
blogsRouter.post('/posts/new', async (req, res) => {
    try {
        const author_id = req.body.author_id
        const title = req.body.title
        const content = req.body.content
        const image_url = req.body.image_url
        
        const result = await query('insert into post(author_id, title, content, image_url) values ($1, $2, $3, $4) returning *',
        [author_id, title, content, image_url])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
   }
})


// update a post
blogsRouter.put('/posts/update/:post_id', async (req, res) => {
    try {
        const post_id = req.params.post_id
        const author_id = req.body.author_id
        const title = req.body.title
        const content = req.body.content
        const image_url = req.body.image_url

        const result = await query('update post set author_id=($1), title=($2), content=($3), image_url=($4) where post_id=($5) returning *',
        [author_id, title, content, image_url, post_id])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// delete a post
blogsRouter.delete('/posts/delete/:post_id', async (req, res) => {
    try {
        const result = await query('delete from post where post_id=($1)', 
        [req.params.post_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json({post_id: req.params.post_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


// get all replies
blogsRouter.get('/replies', async (req, res) => {
    try {
        const result = await query('select * from reply')
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// get replies of a post
blogsRouter.get('/replies/:post_id', async (req, res) => {
    try {
        const result = await query('SELECT r.reply_id, r.post_id, r.content, r.reply_created_time, u.username AS author FROM reply r INNER JOIN user_account u ON r.author_id=u.user_account_id WHERE r.post_id=($1)', 
        [req.params.post_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// add new reply
blogsRouter.post('/replies/new', async (req, res) => {
    try {
        const post_id = req.body.post_id
        const author_id = req.body.author_id
        const content = req.body.content
        
        const result = await query('insert into reply(post_id, author_id, content) values ($1, $2, $3)',
        [post_id, author_id, content])
        res.status(200).json({post_id: post_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
   }
})


// update a post
blogsRouter.put('/replies/update/:reply_id', async (req, res) => {
    try {
        const reply_id = req.params.reply_id
        const content = req.body.content

        const result = await query('update reply set content=($1) where post_id=($2) returning *',
        [content, reply_id])

        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// delete a post
blogsRouter.delete('/replies/delete/:reply_id', async (req, res) => {
    try {
        const result = await query('delete from reply where reply_id=($1)', 
        [req.params.reply_id])
        // in case the result may have no rows
        const rows = result.rows ? result.rows : []
        res.status(200).json({post_id: req.params.post_id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})


module.exports= { blogsRouter }