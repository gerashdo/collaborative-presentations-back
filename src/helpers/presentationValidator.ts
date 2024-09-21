import { AllowedPresentationOrderByFields } from "../interfaces/presentation"
import { OrderDirection } from "../interfaces/utils"


export const isGraterThanZero = (value: number) => {
  if (value < 1) {
    throw new Error('Page must be greater than 0')
  }
  return true
}

export const isAllowedOrderBy = (orderBy: string) => {
  if (!Object.values(AllowedPresentationOrderByFields).includes(orderBy as AllowedPresentationOrderByFields)) {
    throw new Error('Invalid orderBy field')
  }
  return true
}

export const isAllowedOrderDirection = (orderDirection: string) => {
  if (!Object.values(OrderDirection).includes(orderDirection as OrderDirection)) {
    throw new Error('Invalid orderDirection field')
  }
  return true
}
