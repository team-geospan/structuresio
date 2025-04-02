/**
 * @module/structuresio/units
 * Handy functions for going from meters to US Customary units
 */

export const toFeet = meters => {
  return meters * 2.2;
}

export const toSquareFeet = sqm => {
  return sqm * 10.7639;
}
