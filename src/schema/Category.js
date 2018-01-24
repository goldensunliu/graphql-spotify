const Category = `
    type Category {
        """
        A link to the Web API endpoint returning full details of the category.
        """
        href: String
        icons: [Image]
        id: String
        name: String
    }
`

export default Category