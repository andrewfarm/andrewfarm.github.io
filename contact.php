<?php
        if (isset($_POST['submit'])) {
                $to = "andrew.farm@tufts.edu";
                $from = $_POST['email'];
                $name = $_POST['name'];
                $subject = "Contact Form Submission";
                $headers = "From:" . $from;
                $message = "New contact form submission:" .
                           "\n\nName: " . $name .
                           "\nEmail: " . $email .
                           "\nMessage:\n" .
                           $message .
                           "\n\nEnd of message.";

                mail($to, $subject, $message, $headers);

                echo "Thank you for your message!";
        }
?>
