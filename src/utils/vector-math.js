// utils/vector-math.js

/**
 * Calculates the Dot Product (Scalar Product) of two vectors.
 * Dot Product (U . R) = Sum(Ui * Ri)
 * @param {number[]} vectorU - User Profile Vector
 * @param {number[]} vectorR - Item Profile Vector
 * @returns {number} The dot product result.
 */
function dotProduct(vectorU, vectorR) {
    if (vectorU.length !== vectorR.length) {
        throw new Error("Vectors must have the same length for Dot Product calculation.");
    }
    
    let sum = 0;
    for (let i = 0; i < vectorU.length; i++) {
        sum += vectorU[i] * vectorR[i];
    }
    return sum;
}

/**
 * Calculates the Magnitude (Euclidean Norm or Vector Length) of a vector.
 * Magnitude (||V||) = Sqrt(Sum(Vi^2))
 * @param {number[]} vector - A feature vector.
 * @returns {number} The magnitude result.
 */
function magnitude(vector) {
    let sumOfSquares = 0;
    for (let i = 0; i < vector.length; i++) {
        sumOfSquares += vector[i] * vector[i];
    }
    return Math.sqrt(sumOfSquares);
}

/**
 * Calculates the Cosine Similarity between two vectors.
 * This is the core function for Content-Based Filtering.
 * @param {number[]} vectorU - User Profile Vector
 * @param {number[]} vectorR - Item Profile Vector (Restaurant Features)
 * @returns {number} A similarity score between 0 (no similarity) and 1 (identical).
 */
function cosineSimilarity(vectorU, vectorR) {
    const dot_product = dotProduct(vectorU, vectorR);
    const magnitude_u = magnitude(vectorU);
    const magnitude_r = magnitude(vectorR);
    
    // Avoid division by zero. If either vector has zero magnitude (e.g., all features are 0),
    // the similarity is 0.
    if (magnitude_u === 0 || magnitude_r === 0) {
        return 0;
    }
    
    return dot_product / (magnitude_u * magnitude_r);
}

// Export the functions using CommonJS syntax
module.exports = {
    dotProduct,
    magnitude,
    cosineSimilarity
};