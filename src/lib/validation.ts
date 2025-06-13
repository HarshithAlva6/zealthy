export type UserData = {
    email?: string;
    password?: string;
    about?: string;
    birthdate?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  
  export type Config = {
    [key: string]: string[];
  };
  
  export type ValidationErrors = {
    [key: string]: string;
  };
  
  export type ValidationResult = {
    errors: ValidationErrors;
    isValid: boolean;
  };
  
  export const validateStep = (step: number, userData: UserData, config: Config): ValidationResult => {
    
    const errors: ValidationErrors = {};
    if (step === 1) {
      if (!userData.email) errors.email = 'Email is required';
      if (!userData.password) errors.password = 'Password is required';
      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        errors.email = 'Please enter a valid email';
      }
    } else {
      const pageComponents = config[`page${step}`] || [];
      
      pageComponents.forEach((component: string) => {
        if (component === 'about' && !userData.about) {
          errors.about = 'About Me is required';
        }
        if (component === 'birthdate'){
          if (!userData.birthdate) {
            errors.birthdate = 'Birthdate is required';
          } else {
            const birthdate = new Date(userData.birthdate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            if (birthdate > today) {
              errors.birthdate = 'Birthdate cannot be in the future';
            }
          }
        }
        if (component === 'address') {
          if (!userData.address?.street) errors['address.street'] = 'Street is required';
          if (!userData.address?.city) errors['address.city'] = 'City is required';
          if (!userData.address?.state) errors['address.state'] = 'State is required';
          if (!userData.address?.zip) errors['address.zip'] = 'ZIP is required';
        }
      });
    }
    
    return { errors, isValid: Object.keys(errors).length === 0 };
  };