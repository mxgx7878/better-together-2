export const calculatePrice = ({
  price = 0,
  discount = 0,
}) => {
  const originalPrice = Number(price) || 0;
  const discountAmount = Number(discount) || 0;

  const finalPrice = Math.max(originalPrice - discountAmount, 0);

  const savedPercent =
    originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;

  return {
    originalPrice,
    discountAmount,
    finalPrice,
    savedPercent,
    hasDiscount: discountAmount > 0,
  };
};