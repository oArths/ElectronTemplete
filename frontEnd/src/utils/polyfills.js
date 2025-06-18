

if (!Array.prototype.at) {
    Array.prototype.at = function(pos) {
    /**
     * Normalizes the position value.
     *
     * @param {number} pos - The position value to be normalized.
     * @returns {number} - The normalized position value.
     */
      let normalizedPos = Number(pos) >= 0 ? pos : this.length + pos;
      return this[normalizedPos];
    };
}