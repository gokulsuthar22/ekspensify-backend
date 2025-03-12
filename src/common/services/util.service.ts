import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { utc, Moment } from 'moment';

@Injectable()
export class UtilService {
  /**
   * Generates a random code of 'n' digits.
   *
   * @param {number} n - The number of digits for the random code.
   * @returns {number} - The random code.
   */
  generateRandomCode = (n: number): number => {
    const min = Math.pow(10, n - 1); // Minimum value with 'n' digits
    const max = Math.pow(10, n) - 1; // Maximum value with 'n' digits
    return Math.floor(min + Math.random() * (max - min + 1)); // Random value between min and max
  };

  /**
   * Adds a specified number of minutes to the current time.
   * @param {number} n - The number of minutes to add.
   * @returns {Moment} - The current time + the added minutes.
   */
  addMinutes = (n: number): Moment => {
    return utc().add(n, 'minutes');
  };

  /**
   * Generates a slug from a given string using `slugify`.
   * @param {string} text - The string to be converted into a slug.
   * @returns {string} - The generated slug.
   */
  slugifyText = (...args: string[]): string => {
    return slugify(args.join(' '), {
      lower: true,
      trim: true,
      strict: true,
    });
  };

  /**
   * Converts RGB color values to HEX format.
   *
   * @param {number} r - The red component of the color (0-255).
   * @param {number} g - The green component of the color (0-255).
   * @param {number} b - The blue component of the color (0-255).
   * @returns {string} The HEX representation of the RGB color (e.g., "#4287F5").
   */
  rgbToHex(r: number, g: number, b: number): string {
    // Combine the RGB values into a single number using bitwise operations
    // Convert the number to a hexadecimal string and extract the last 6 characters
    // Use .toUpperCase() to ensure the HEX code is in uppercase format
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
  }
}
