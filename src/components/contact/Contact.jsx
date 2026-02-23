import "./contact.css";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import ContactSvg from "./ContactSvg";

const listVariant = {
  initial: {
    x: 100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const Contact = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const ref = useRef();
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(false);

    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        form.current,
        {
          publicKey: import.meta.env.VITE_PUBLIC_KEY,
        }
      )
      .then(
        () => {
          setSuccess(true);
          setError(false);
          setLoading(false);
          form.current.reset();
        },
        (error) => {
          console.log(error);
          setError(true);
          setSuccess(false);
          setLoading(false);
        }
      );
  };

  const isInView = useInView(ref, { margin: "-200px" });

  return (
    <div className="contact" id="contact" ref={ref}>
      <div className="cSection">
        <motion.form
          ref={form}
          onSubmit={sendEmail}
          variants={listVariant}
          animate={isInView ? "animate" : "initial"}
        >
          <motion.h1 variants={listVariant} className="cTitle">
            Let's Work Together
          </motion.h1>
          <motion.p variants={listVariant} style={{ marginBottom: '20px', color: '#666' }}>
            Have a project in mind? Feel free to reach out at{' '}
            <a href="mailto:harshpandeyiitian04@gmail.com" style={{ color: '#dd4c62' }}>
              harshpandeyiitian04@gmail.com
            </a>
          </motion.p>
          <motion.div variants={listVariant} className="formItem">
            <label>Name</label>
            <input 
              type="text" 
              name="user_name" 
              placeholder="Your Name" 
              required 
            />
          </motion.div>
          <motion.div variants={listVariant} className="formItem">
            <label>Email</label>
            <input
              type="email"
              name="user_email"
              placeholder="your.email@example.com"
              required
            />
          </motion.div>
          <motion.div variants={listVariant} className="formItem">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Project Inquiry"
              required
            />
          </motion.div>
          <motion.div variants={listVariant} className="formItem">
            <label>Message</label>
            <textarea
              rows={10}
              name="message"
              placeholder="Tell me about your project..."
              required
            ></textarea>
          </motion.div>
          <motion.button 
            variants={listVariant} 
            className="formButton"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </motion.button>
          {success && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#4caf50', fontWeight: 'bold' }}
            >
              ✓ Message sent successfully! I'll get back to you soon.
            </motion.span>
          )}
          {error && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: '#f44336', fontWeight: 'bold' }}
            >
              ✗ Failed to send message. Please email me directly.
            </motion.span>
          )}
        </motion.form>
      </div>
      <div className="cSection">
        <ContactSvg />
      </div>
    </div>
  );
};

export default Contact;