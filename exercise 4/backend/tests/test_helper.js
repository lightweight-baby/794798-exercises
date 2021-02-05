const Blog = require('../models/blog')
const User = require('../models/user')

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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}