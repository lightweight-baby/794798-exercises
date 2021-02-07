const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

//make sure db is in same state for each test. reset db so to say
beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


//begin testing
describe('when there are 2 blogs in the db initially,', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two blogs', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('blogs contain author merkel', async () => {
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.author)
        expect(contents).toContain('Angela Merkel')
    })
})


describe('when a blog is posted to api', () => {
    let headers

    beforeEach(async () => {
        const newUser = {
            username: 'janedoez',
            name: 'Jane Z. Doe',
            password: 'password',
        }

        await api
            .post('/api/users')
            .send(newUser)

        const result = await api
            .post('/api/login')
            .send(newUser)

        headers = {
            'Authorization': `bearer ${result.body.token}`
        }
    })

    test('it is saved to database', async () => {
        const newBlog = {
            title: 'Great developer experience',
            author: 'Hector Ramos',
            url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
            likes: 7
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
            'Great developer experience'
        )
    })

    test('likes get value 0 as default', async () => {
        const newBlog = {
            title: 'Blazing Fast Delightful Testing',
            author: 'Rick Hanlon',
            url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience'
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const added = blogsAtEnd.find(b => b.url === newBlog.url)

        expect(added.likes).toBe(0)
    })

    test('operation fails with proper error if url is missing', async () => {
        const newBlog = {
            title: 'Blazing Fast Delightful Testing',
            author: 'Rick Hanlon',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set(headers)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('operation fails with proper error if token is missing', async () => {
        const newBlog = {
            title: 'Blazing Fast Delightful Testing',
            author: 'Rick Hanlon',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    describe('and it is saved to database', () => {
        let result
        beforeEach(async () => {
            const newBlog = {
                title: 'Great developer experience',
                author: 'Hector Ramos',
                url: 'https://jestjs.io/blog/2017/01/30/a-great-developer-experience',
                likes: 7
            }

            result = await api
                .post('/api/blogs')
                .send(newBlog)
                .set(headers)
        })

        test('it can be removed', async () => {
            const aBlog = result.body
            console.log('result.body:', aBlog)
            console.log('headers:', headers)
            const initialBlogs = await helper.blogsInDb()
            await api
                .delete(`/api/blogs/${aBlog.id}`)
                .set(headers)
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()
            expect(blogsAtEnd.length).toBe(initialBlogs.length - 1)

            const titles = blogsAtEnd.map(b => b.title)
            expect(titles).not.toContain(
                aBlog.title
            )
        })
    })
})

describe('view specific blog', () => {
    test('succeeds with valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()

        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        console.log(validNonexistingId)

        await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 id is invalid', async () => {
        const invalidId = 'yoloooo666'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})






afterAll(() => {
    mongoose.connection.close()
})