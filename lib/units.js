/* v8 ignore start */

/**
 * Copyright GEOSPAN Corp
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module/structuresio/units
 * Handy functions for going from meters to US Customary units
 */

export const toFeet = (meters) => {
  return meters * 3.28084;
};

export const toSquareFeet = (sqm) => {
  return sqm * 10.7639;
};
