"use client"
import { useState, useRef } from "react"
import type React from "react"
import Image from "next/image"
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"

export default function ContactSection() {
  const [result, setResult] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setResult("Sending...")

    const formData = new FormData(event.target as HTMLFormElement)
    formData.append("access_key", "edd717f4-6dcf-43d3-ba85-25a3518e24e2") // Replace with your actual access key

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setResult("Form Submitted Successfully")
        ;(event.target as HTMLFormElement).reset()
      } else {
        setResult("An error occurred while submitting the form.")
      }
    } catch (error) {
      setResult("An error occurred while submitting the form.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section id="contact" ref={ref} className="py-20 px-4 sm:px-8 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full opacity-50 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50 rounded-full opacity-50 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you have questions, feedback, or partnership inquiries, we are here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="flex flex-col space-y-6 bg-blue-50 p-8 rounded-xl shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <FaEnvelope className="text-blue-500 text-xl" />
              </div>
              <a
                href="mailto:umarhab8b231@gmail.com"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              >
                umarhab8b231@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <FaPhone className="text-blue-500 text-xl" />
              </div>
              <a
                href="tel:++923410439344"
                className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
              >
                +923410439344
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <FaMapMarkerAlt className="text-blue-500 text-xl" />
              </div>
              <span className="text-gray-600">University of Poonch, Rawalakot</span>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            onSubmit={onSubmit}
            className="flex flex-col space-y-4 bg-white p-8 rounded-xl shadow-md border border-blue-100"
          >
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-4 rounded-lg bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                required
              />
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-4 rounded-lg bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                required
              />
            </div>
            <div className="relative">
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full p-4 rounded-lg bg-blue-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                rows={5}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {result && <p className="text-center text-blue-500">{result}</p>}
          </motion.form>

          {/* Image */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-30"></div>
              <Image src="/getintouch.png" alt="Get in touch" width={300} height={300} className="relative z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

