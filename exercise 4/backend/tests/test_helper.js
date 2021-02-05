const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Ethereum will break 69,696',
        author: 'Steve',
        url: 'google.com',
        likes: 2
    },
    {
        title: 'diamond hands',
        author: 'Angela Merkel',
        url: 'facebook.com',
        likes: 6666
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', likes: 0 })
    await blog.save()
    await blog.remove()

    return blog._id.toString({})
}

const blogsInDb = async () => {
    const blogs = await Blog.find()
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}