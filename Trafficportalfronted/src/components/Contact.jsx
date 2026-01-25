import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import emailjs from "emailjs-com";
// import Footer from "./Footer"; // Footer handled by parent component

const Contact = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [messageSent, setMessageSent] = useState(null);

    const inputStyle = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
        },
        "& .MuiInputLabel-root": {
            color: "black", // Changed to black for better visibility against white background
        },
        "& .MuiInput-underline:before": {
            borderBottomColor: "black",
        },
        "&:hover .MuiOutlinedInput-root": {
            borderColor: "black",
        },
    };

    const onSubmit = (data) => {
        const emailParams = {
            from_name: data.fullName,
            email: data.email, // Required for 'To Email' ({{email}})
            reply_to: data.email,
            message: data.message,
        };

        emailjs
            .send(
                "service_q9677jj", // Updated Service ID from user prompt
                "template_1z763jj", // Updated Template ID
                emailParams,
                "Dv8hLLn2aELFSWcCg" // Public Key
            )
            .then((response) => {
                console.log("SUCCESS!", response.status, response.text);
                setMessageSent("Your message has been sent successfully!");
                reset();
            })
            .catch((err) => {
                console.error("FAILED...", err);
                setMessageSent(
                    `Failed to send the message. Error: ${err.text || "Unknown error"}`
                );
            });
    };

    return (
        <div
            style={{
                marginTop: "2rem",
                padding: "10px",
                backgroundColor: "white",
                color: "black",
                marginBottom: "2rem !important",
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Contact Us
            </Typography>
            <Typography variant="body1" align="center" paragraph>
                We are here to assist you! Feel free to reach out to us for any
                inquiries or feedback.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={4}>
                    <Card
                        variant="outlined"
                        style={{
                            height: "100%",
                            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)", // Adjusted shadow visibility
                            borderRadius: "8px",
                            backgroundColor: "white",
                            color: "black",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5">Address</Typography>
                            <Typography variant="body2">
                                KL UNIVERSITY, VADHESHWARAM
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card
                        variant="outlined"
                        style={{
                            height: "100%",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            backgroundColor: "white",
                            color: "black",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5">Phone</Typography>
                            <Typography variant="body2"> +91-181-010-101 </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card
                        variant="outlined"
                        style={{
                            height: "100%",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                            backgroundColor: "white",
                            color: "black",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5">Emails</Typography>
                            <Typography variant="body2">
                                2300030244@kluniversity.in
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <div style={{ marginTop: "20px" }}>
                <Typography variant="h5">Send Message</Typography>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        maxWidth: "400px",
                        margin: "auto",
                    }}
                >
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        required
                        {...register("fullName", {
                            required: "Full Name is required",
                            pattern: {
                                value: /^[A-Za-z\s]+$/,
                                message: "Only alphabets are allowed",
                            },
                        })}
                        error={Boolean(errors.fullName)}
                        helperText={errors.fullName?.message}
                        style={{ margin: "10px 0" }}
                        color="warning"
                        InputLabelProps={{ style: { color: "black" } }}
                        InputProps={{ style: { color: "black" } }}
                        sx={inputStyle}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        required
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email",
                            },
                        })}
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        style={{ margin: "10px 0" }}
                        color="warning"
                        InputLabelProps={{ style: { color: "black" } }}
                        InputProps={{ style: { color: "black" } }}
                        sx={inputStyle}
                    />
                    <TextField
                        label="Type your Message"
                        variant="outlined"
                        required
                        multiline
                        rows={4}
                        {...register("message", { required: "Message is required" })}
                        error={Boolean(errors.message)}
                        helperText={errors.message?.message}
                        style={{ margin: "10px 0" }}
                        color="warning"
                        InputLabelProps={{ style: { color: "black" } }}
                        InputProps={{ style: { color: "black" } }}
                        sx={inputStyle}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "black", // Changed to black for contrast
                            color: "white",
                            border: "2px solid black",
                            "&:hover": {
                                backgroundColor: "darkgray",
                            },
                            marginTop: "10px",
                        }}
                        type="submit"
                    >
                        Send
                    </Button>
                </form>

                {/* Success or error message display */}
                {messageSent && (
                    <Typography
                        variant="body1"
                        align="center"
                        style={{
                            marginTop: "20px",
                            color: messageSent.includes("successfully") ? "green" : "red",
                            fontWeight: "bold",
                        }}
                    >
                        {messageSent}
                    </Typography>
                )}
            </div>
        </div>
    );
};

export default Contact;
