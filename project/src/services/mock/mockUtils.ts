/**
 * Simulates network latency for mock API calls
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simulates random API errors for testing error handling
 * @param errorRate Probability of error (0-1)
 */
export const shouldSimulateError = (errorRate: number = 0.1): boolean => {
  return Math.random() < errorRate;
};

/**
 * Generates a random UUID for mock data
 */
export const generateMockId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Simulates pagination for mock data
 */
export const paginateArray = <T>(
  array: T[],
  page: number,
  limit: number
): { data: T[]; pagination: any } => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = array.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
    },
  };
};