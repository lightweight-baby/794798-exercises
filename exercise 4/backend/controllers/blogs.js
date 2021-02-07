const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { name: 1, username: 1 })
    //response.json(blogs.map(blog => blog.toJSON()))
    //seems to work the same way as
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}


blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    //const decodedToken = jwt.verify(request.token, process.env.SECRET)
    //i'm not sure whether this is equivalent. didn't work in delete.

    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!blog.url || !blog.title) {
        return response.status(400).send({ error: 'title or url missing ' })
    }

    if (!blog.likes) {
        blog.likes = 0
    }

    blog.user = user
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    //request.token is not the same as the token from the extreact token function. don't over-simplify.
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log('aight deleting...')
    console.log('token:', token)
    console.log('decodedtoken:', decodedToken)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== user.id.toString()) {
        return response.status(401).json({ error: 'only the creator can delete blogs' })
    }

    await blog.remove()
    user.blogs = user.blogs.filter(b => b.id.toString() !== request.params.id.toString())
    await user.save()
    response.status(204).end()
})

module.exports = blogsRouter