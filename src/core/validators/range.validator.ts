// Validator for index selection, returns true/false
export const rangeValidator = (min: number, max: number) => {
  return (value: string): boolean => {
    const num = Number(value);
    if (isNaN(num)) {
      console.log("Enter a valid number.");
      return false;
    }

    if (!Number.isInteger(num)) {
      console.log("Enter an integer value.");
      return false;
    }

    if (num < min || num > max) {
      console.log(`Select a number between ${min} and ${max}.`);
      return false;
    }

    return true; // valid
  };
};
