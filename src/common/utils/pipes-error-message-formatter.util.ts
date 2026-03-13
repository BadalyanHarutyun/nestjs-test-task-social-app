import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export function pipesErrorMessageFormatter(errors: ValidationError[]) {
  const formattedErrors = errors.reduce((acc, err) => {
    const constraints = err.constraints;
    const messages = constraints ? Object.values(constraints) : [];
    acc[err.property] = messages.length > 0 ? messages[0] : 'Invalid value';
    return acc;
  }, {});

  return new BadRequestException(formattedErrors);
}
