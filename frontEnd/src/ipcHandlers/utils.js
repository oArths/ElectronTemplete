/**
 * utils.js
 * 
 * This file contains utility functions for encryption and key generation.
 * 
 * Author: Joaquín Ayala
 * Email: joaquin.ayala.c@gmail.com
 * 
 * Functions:
 * - ownEncryption(input): Encrypts the given input string using Triple DES (3DES) encryption with CBC mode.
 * - generateKeyPass(): Generates a key pass based on the current date in the format YYYYMMDDMFA.
 * - generateMD5(input): Generates an MD5 hash of the given input string.
 * - encryption(email): Encrypts the given email along with a generated key pass.
 */


const crypto = require("crypto");

/**
 * Encrypts the given input string using Triple DES (3DES) encryption with CBC mode.
 * The encrypted string is then encoded in base64 and certain characters are replaced
 * with custom strings to make it URL-safe.
 *
 * @param {string} input - The input string to be encrypted.
 * @returns {string} - The encrypted and URL-safe string.
 */
function ownEncryption(input) {
    const iv = Buffer.from("TERAnetK", "ascii"); // Initialization vector (IV) must be 8 characters long
    const encryptionKey = Buffer.from(
        "TERAnetodPfTnYspBIy/KANTARpstmfu",
        "base64"
    ); // Encryption key must not be altered

    const cipher = crypto.createCipheriv("des-ede3-cbc", encryptionKey, iv);
    let encrypted = cipher.update(input, "utf8", "base64");
    encrypted += cipher.final("base64");

    // Replace certain characters to make the string URL-safe
    encrypted = encrypted
        .replace(/:/g, "ktr01")
        .replace(/\//g, "ktr02")
        .replace(/\?/g, "ktr03")
        .replace(/#/g, "ktr04")
        .replace(/\[/g, "ktr05")
        .replace(/]/g, "ktr06")
        .replace(/@/g, "ktr07")
        .replace(/!/g, "ktr08")
        .replace(/\$/g, "ktr09")
        .replace(/&/g, "ktr10")
        .replace(/'/g, "ktr11")
        .replace(/\(/g, "ktr12")
        .replace(/\)/g, "ktr13")
        .replace(/\*/g, "ktr14")
        .replace(/\+/g, "ktr15")
        .replace(/,/g, "ktr16")
        .replace(/;/g, "ktr17")
        .replace(/=/g, "ktr18");

    return encrypted;
}

/**
 * Generates a key pass based on the current date in the format YYYYMMDDMFA.
 * The generated string is then hashed using MD5.
 *
 * @returns {string} - The MD5 hash of the generated key pass.
 */
function generateKeyPass() {
    const today = new Date();
    let year = today.getFullYear().toString();
    let month = (today.getMonth() + 1).toString(); // Months are 0-based in JavaScript, so add 1.
    let day = today.getDate().toString();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    const inputString = year + month + day + 'MFA';
    
    return generateMD5(inputString);
}

/**
 * Generates an MD5 hash of the given input string.
 *
 * @param {string} input - The input string to be hashed.
 * @returns {string} - The MD5 hash of the input string.
 */
function generateMD5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
}

/**
 * Encrypts the given email along with a generated key pass.
 * The resulting encrypted string is URL-safe and can be used in a GET request.
 *
 * @param {string} email - The email to be encrypted.
 * @returns {string} - The encrypted and URL-safe string.
 */
function encryption(email) {
    return ownEncryption("user=" + email + "&key=" + generateKeyPass());
}

export { encryption };