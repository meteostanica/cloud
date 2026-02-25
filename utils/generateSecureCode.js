export default () => {
    // Generate a random 32-bit unsigned integer
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);

    // Use modulo to get a value within 1,000,000
    // Then pad with leading zeros if you want 000000-999999
    // Or adjust the math if you strictly want 100,000-999,999
    const number = array[0] % 1000000;

    return number.toString().padStart(6, '0');
}