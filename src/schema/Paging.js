const Paging = `
    union Item = Playlist | PlaylistTrack | Category
    type Paging {
        href: String
        items: [Item]
        limit: Int
        offset: Int
        total: Int
    }
`;

export default Paging