// ASSUMPTIONS: 
// 1. userVector is the array [u1, u2, u3, ...]
// 2. allRestaurantVectors is an array of objects {id: R_ID, vector: [r1, r2, r3, ...]}
// 3. dotProduct(v1, v2) and magnitude(v) are helper functions

function calculateCosineSimilarity(uVector, rVector) {
    if (uVector.length !== rVector.length) {
        throw new Error("Vectors must have the same length!");
    }
    
    // Calculate the components of the formula
    const dot_product = dotProduct(uVector, rVector);
    const magnitude_u = magnitude(uVector); // ||U||
    const magnitude_r = magnitude(rVector); // ||R||
    
    // Avoid division by zero if a vector is zero (e.g., cold start user)
    if (magnitude_u === 0 || magnitude_r === 0) {
        return 0; 
    }
    
    return dot_product / (magnitude_u * magnitude_r);
}

async function generateRecommendations(userId) {
    // 1. Fetch User Profile
    const userProfile = await UserProfile.findOne({ user: userId });
    const userVector = userProfile.cbf_user_vector;
    
    // 2. Fetch all Candidate Restaurant Vectors
    const allCandidates = await RestaurantFeatures.find({}); // Filter out interacted items here!
    
    let scores = [];
    
    // 3. Iterate and Score
    for (const candidate of allCandidates) {
        const score = calculateCosineSimilarity(userVector, candidate.cbf_cuisine_vector);
        
        scores.push({
            restaurantId: candidate.restaurant,
            similarityScore: score
        });
    }
    
    // 4. Sort and Output
    scores.sort((a, b) => b.similarityScore - a.similarityScore);
    
    // Return top N
    return scores.slice(0, 20); 
}