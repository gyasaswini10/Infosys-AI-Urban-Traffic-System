package klu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    Long vehicleId;

    @Column(name = "reg_no", unique = true)
    String regNo;

    @Column(name = "type")
    String type;

    @Column(name = "model")
    String model;

    @Column(name = "status")
    Integer status; // 1: Active, 2: Inactive

    @Column(name = "location")
    String location;

    @Column(name = "speed")
    Integer speed;

    @Column(name = "battery_level")
    Integer batteryLevel;

    @Column(name = "mileage")
    Double mileage;

    @Column(name = "engine_health")
    Integer engineHealth; // 0-100%

    @Column(name = "tire_health")
    Integer tireHealth; // 0-100%

    @Column(name = "last_service")
    String lastServiceDate;

    @Column(name = "userid")
    String userid; // Link to the user who registered it (Email)

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    // ...

    public Double getMileage() {
        return mileage;
    }

    public void setMileage(Double mileage) {
        this.mileage = mileage;
    }

    public Integer getEngineHealth() {
        return engineHealth;
    }

    public void setEngineHealth(Integer engineHealth) {
        this.engineHealth = engineHealth;
    }

    public Integer getTireHealth() {
        return tireHealth;
    }

    public void setTireHealth(Integer tireHealth) {
        this.tireHealth = tireHealth;
    }

    public String getLastServiceDate() {
        return lastServiceDate;
    }

    public void setLastServiceDate(String lastServiceDate) {
        this.lastServiceDate = lastServiceDate;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getRegNo() {
        return regNo;
    }

    public void setRegNo(String regNo) {
        this.regNo = regNo;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getSpeed() {
        return speed;
    }

    public void setSpeed(Integer speed) {
        this.speed = speed;
    }

    public Integer getBatteryLevel() {
        return batteryLevel;
    }

    public void setBatteryLevel(Integer batteryLevel) {
        this.batteryLevel = batteryLevel;
    }

}
