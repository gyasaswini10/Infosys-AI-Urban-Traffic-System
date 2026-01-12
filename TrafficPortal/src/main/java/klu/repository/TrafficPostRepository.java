package klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

import klu.model.TrafficPost;

@Repository
public interface TrafficPostRepository extends JpaRepository<TrafficPost, Long> {

    @Query("select t from TrafficPost t where t.location like %:keyword%")
    public List<TrafficPost> postsByLocation(@Param("keyword") String keyword);

    @Query("select count(t) from TrafficPost t")
    public long countAllPosts();

    @Query("select count(t) from TrafficPost t where t.severity=:severity")
    public long countBySeverity(@Param("severity") String severity);

}
