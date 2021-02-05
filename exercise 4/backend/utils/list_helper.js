const dummy = () => {
    return 1
}

const totalLikes = (list) => {
    const reducer = (accumulator, currentValue) => accumulator + currentValue.likes

    return list.reduce(reducer, 0)
}

module.exports = {
    dummy,
    totalLikes
}