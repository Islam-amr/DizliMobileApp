class Cart {
  constructor(
    tax,
    amount,
    // vehicle_type,
    // payment_type,
    products,
    team_id,
    // delivery_type,
    merchant_id,
    // customer_notification_language,
    // customer_notification_type,
    // destination,
  ) {
    this.tax = tax;
    this.amount = amount;
    // this.vehicle_type = vehicle_type;
    // this.payment_type = payment_type;
    this.products = products;
    this.team_id = team_id;
    // this.delivery_type = delivery_type;
    this.merchant_id = merchant_id;
    // this.customer_notification_language = customer_notification_language;
    // this.customer_notification_type = customer_notification_type;
    // this.destination = destination;
  }
}

export default Cart;
