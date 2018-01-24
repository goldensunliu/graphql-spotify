// TODO after all parameters on targting attributes from https://beta.developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
const RecommendationParameters = `
    input RecommendationParameters {
        limit: Int
        seed_artists: [String]
        seed_genres: [String]
        seed_tracks: [String]
    }
`;

export default RecommendationParameters