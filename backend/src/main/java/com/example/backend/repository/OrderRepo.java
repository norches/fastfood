package com.example.backend.repository;

import com.example.backend.entity.Order;
import com.example.backend.projection.OrderProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface OrderRepo extends JpaRepository<Order, UUID> {
@Query(value = """
select orders.id as orderId,u.id as userId,u.first_name as firstName,u.last_name as lastName,json_agg(jsonb_build_object('name',p.name,'amount',op.quantity,'price',p.price)) as orders, orders.total_price as total, orders.location as location, orders.created_at as createdAt  from orders  inner join orders_order_products orp on orders.id = orp.orders_id
inner join order_product op on orp.order_products_id = op.id inner join  users u on orders.user_id = u.id
inner join  product p on op.product_id = p.id where u.id=:id
                       group by u.id,orders.id,orders.location,orders.created_at                                          
""",nativeQuery = true)


    List<OrderProjection> getUserOrders(UUID id);

    @Query(value = """
            select orders.id as orderId,u.id as userId,u.first_name as firstName,u.last_name as lastName,json_agg(jsonb_build_object('name',p.name,'amount',op.quantity,'price',p.price)) as orders, orders.total_price as total, orders.location as location, orders.created_at as createdAt  from orders  inner join orders_order_products orp on orders.id = orp.orders_id
            inner join order_product op on orp.order_products_id = op.id inner join  users u on orders.user_id = u.id
            inner join  product p on op.product_id = p.id
                           group by u.id,orders.id,orders.location,orders.created_at                                          
            """,nativeQuery = true)
    List<OrderProjection> getAllOrders();

    @Query("SELECT o FROM orders o WHERE o.createdAt < :cutoffTime")
    List<Order> findOrdersOlderThan(LocalDateTime cutoffTime);
}

