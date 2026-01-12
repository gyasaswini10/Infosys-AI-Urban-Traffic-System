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
    int status; // 1: Active, 2: Inactive

    @Column(name = "location")
    String location;

    @Column(name = "speed")
    int speed;

    @Column(name = "battery_level")
    int batteryLevel;

    @Column(name = "mileage")
    double mileage;

    @Column(name = "engine_health")
    int engineHealth; // 0-100%

    @Column(name = "tire_health")
    int tireHealth; // 0-100%

    @Column(name = "last_service")
    String lastServiceDate;

    public Long getVehicleId() {
        return vehicleId;
    }

    // ...
    public void setBatteryLevel(int batteryLevel) {
        this.batteryLevel = batteryLevel;
    }

    public double getMileage() {
        return mileage;
    }

    public void setMileage(double mileage) {
        this.mileage = mileage;
    }

    public int getEngineHealth() {
        return engineHealth;
    }

    public void setEngineHealth(int engineHealth) {
        this.engineHealth = engineHealth;
    }

    public int getTireHealth() {
        return tireHealth;
    }

    public void setTireHealth(int tireHealth) {
        this.tireHealth = tireHealth;
    }

    public String getLastServiceDate() {
        return lastServiceDate;
    }

    public void setLastServiceDate(String lastServiceDate) {
        this.lastServiceDate = lastServiceDate;
    }

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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getSpeed() {
        return speed;
    }

    public void setSpeed(int speed) {
        this.speed = speed;
    }

    public int getBatteryLevel() {
        return batteryLevel;
    }

    public void setBatteryLevel(int batteryLevel) {
        this.batteryLevel = batteryLevel;
    }

}
