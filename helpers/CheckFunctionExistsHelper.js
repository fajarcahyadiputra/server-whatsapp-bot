function isFunctionExists(f) {
    if (typeof f === "function") {
        return true;
    } else if (typeof f === "string") {
        try {
            return eval(`typeof ${f} === "function"`);
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

module.exports = isFunctionExists