from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
import urllib.parse
import os

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'russellsecom@gmail.com'  # Replace with your Gmail address
app.config['MAIL_PASSWORD'] = 'utce coyx hwrn fnqo'     # Replace with Gmail App Password
app.config['MAIL_DEFAULT_SENDER'] = 'russellsecom@gmail.com'
mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/send_whatsapp', methods=['POST'])
def send_whatsapp():
    data = request.json
    try:
        # Customize the WhatsApp number and message
        phone_number = "+923069844462"  # Replace with your WhatsApp number
        message = (
            f"New Inquiry from {data['name']}!\n"
            f"Email: {data['email']}\n"
            f"Phone: {data['phone']}\n"
            f"Service: {data['service']}\n"
            f"Message: {data['message']}"
        )
        encoded_message = urllib.parse.quote(message)
        whatsapp_url = f"https://wa.me/{phone_number}?text={encoded_message}"
        return jsonify({"status": "success", "whatsapp_url": whatsapp_url})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/send_message', methods=['POST'])
def send_message():
    try:
        data = {
            'name': request.form.get('name'),
            'email': request.form.get('email'),
            'phone': request.form.get('phone'),
            'service': request.form.get('service'),
            'message': request.form.get('message')
        }
        # Email to admin
        msg_admin = Message(
            subject="New Message from Academy Website",
            recipients=["russellsecom@gmail.com"],
            body=f"""
            Name: {data['name']}
            Email: {data['email']}
            Phone: {data['phone']}
            Service: {data['service']}
            Message: {data['message']}
            """
        )
        mail.send(msg_admin)

        # Confirmation email to user
        msg_user = Message(
            subject="Thank you for contacting us",
            recipients=[data['email']],
            body="We've received your message and will get back to you soon!"
        )
        mail.send(msg_user)

        return jsonify({"status": "success", "message": "Message sent successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/enroll-course', methods=['POST'])
def enroll_course():
    try:
        data = {
            'full_name': request.form.get('full_name'),
            'email': request.form.get('email'),
            'phone': request.form.get('phone'),
            'experience_level': request.form.get('experience_level'),
            'motivation': request.form.get('motivation'),
            'course_name': request.form.get('course_name')
        }
        # Email to admin
        msg_admin = Message(
            subject=f"New Enrollment: {data['course_name']}",
            recipients=["admin@yourdomain.com"],
            body=f"""
            New Enrollment Request
            Course: {data['course_name']}
            Name: {data['full_name']}
            Email: {data['email']}
            Phone: {data['phone']}
            Experience Level: {data['experience_level']}
            Motivation: {data['motivation']}
            """
        )
        mail.send(msg_admin)

        # Confirmation email to user
        msg_user = Message(
            subject=f"Thank you for enrolling in {data['course_name']}!",
            recipients=[data['email']],
            body=f"""
            Dear {data['full_name']},
            Thank you for enrolling in {data['course_name']} at RECOM! 
            We'll contact you soon with next steps.
            """
        )
        mail.send(msg_user)

        return jsonify({"status": "success", "message": "Enrollment successful! Check your email for confirmation."})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
