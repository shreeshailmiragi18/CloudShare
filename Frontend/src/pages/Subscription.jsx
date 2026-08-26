import { AlertCircle, Check, CreditCard } from "lucide-react";
import UserCreditsContext from "../context/UserCreditsContext";
import DashboardLayout from "../layout/DashboardLayout";
import { useAuth } from "@clerk/clerk-react";
import { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";

const Subscription = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { getToken } = useAuth();
  const razorpayScriptRef = useRef(null);

  const { credits, setCredits } = useContext(UserCreditsContext);

  // Load Razorpay Script
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        console.log("Razorpay script loaded");
        setRazorpayLoaded(true);
      };

      script.onerror = () => {
        console.error("Failed to load Razorpay script");
        setMessage("Failed to load Razorpay. Please try again later.");
        setMessageType("error");
        setRazorpayLoaded(false);
      };

      document.body.appendChild(script);
      razorpayScriptRef.current = script;
    } else {
      setRazorpayLoaded(true);
    }

    return () => {
      if (
        razorpayScriptRef.current &&
        document.body.contains(razorpayScriptRef.current)
      ) {
        document.body.removeChild(razorpayScriptRef.current);
      }
    };
  }, []);

  // Fetch current user credits
  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const token = await getToken();

        const response = await axios.get(
          "http://localhost:8080/api/v1.0/users/credits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCredits(response.data.credits);
      } catch (error) {
        console.error("Error fetching user credits:", error);

        setMessage("Failed to fetch user credits.");
        setMessageType("error");
      }
    };

    fetchUserCredits();
  }, [getToken, setCredits]);

  const plans = [
    {
      id: "basic",
      name: "Basic",
      credits: 100,
      price: 100,
      features: [
        "Upload up to 100 files",
        "Access to basic features",
        "Standard customer support",
      ],
      recommended: false,
    },
    {
      id: "ultimate",
      name: "Ultimate",
      credits: 2500,
      price: 2000,
      features: [
        "Upload up to 2500 files",
        "Access to all premium features",
        "Priority customer support",
        "Advanced analytics and reporting",
      ],
      recommended: true,
    },
    {
      id: "premium",
      name: "Premium",
      credits: 500,
      price: 500,
      features: [
        "Upload up to 500 files",
        "Access to all basic features",
        "Priority customer support",
      ],
      recommended: false,
    },
  ];

  const handlePayment = async (plan) => {
    try {
      setProcessingPayment(true);
      setMessage("");
      setMessageType("");

      const token = await getToken();

      // Create Razorpay order from backend
      const response = await axios.post(
        "http://localhost:8080/api/v1.0/payments/create-order",
        {
          amount: plan.price * 100,
          currency: "INR",
          planId: plan.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: "INR",
        name: "CloudShare",
        description: `${plan.name} Plan - ${plan.credits} Credits`,
        order_id: response.data.orderId,

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await axios.post(
              "http://localhost:8080/api/v1.0/payments/verify-payment",
              {
                ...paymentResponse,
                planId: plan.id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (verifyResponse.data.success) {
              setCredits(verifyResponse.data.credits);

              setMessage(`Payment successful! ${plan.credits} credits added.`);
              setMessageType("success");
            } else {
              setMessage(
                verifyResponse.data.message || "Payment verification failed.",
              );
              setMessageType("error");
            }
          } catch (error) {
            console.error("Payment verification error:", error);

            setMessage("Payment verification failed.");
            setMessageType("error");
          } finally {
            setProcessingPayment(false);
          }
        },

        theme: {
          color: "#7C3AED",
        },

        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to process payment.",
      );

      setMessageType("error");
      setProcessingPayment(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Subscription">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Choose Your Plan
          </h1>

          <p className="text-gray-500 mt-2">
            Select the perfect plan and get more credits for your uploads.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-xl flex items-center gap-3 border ${
              messageType === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : messageType === "success"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            {messageType === "error" && <AlertCircle size={20} />}

            {message}
          </div>
        )}

        {/* Current Credits */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-4 bg-white border border-purple-100 shadow-sm rounded-xl px-5 py-4">
            <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
              <CreditCard className="text-purple-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Current Available Credits</p>

              <p className="text-xl font-bold text-purple-600">{credits}</p>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 items-center">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl bg-white transition-all duration-300 flex flex-col ${
                plan.recommended
                  ? `
                    border-2 border-purple-500
                    shadow-xl
                    lg:scale-110
                    lg:z-10
                    py-8
                  `
                  : `
                    border border-gray-200
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-1
                    py-6
                  `
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-violet-500 text-white text-xs font-bold tracking-wide px-5 py-2 rounded-full shadow-md">
                    RECOMMENDED
                  </span>
                </div>
              )}

              <div className="px-7 flex flex-col flex-1">
                {/* Plan Name */}
                <h3
                  className={`font-bold text-gray-900 ${
                    plan.recommended ? "text-2xl" : "text-xl"
                  }`}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mt-4 flex items-end gap-2">
                  <span
                    className={`font-bold text-gray-900 ${
                      plan.recommended ? "text-4xl" : "text-3xl"
                    }`}
                  >
                    ₹{plan.price}
                  </span>

                  <span className="text-sm text-gray-500 mb-1">
                    for {plan.credits} credits
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 my-6" />

                {/* Features */}
                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <Check
                        size={18}
                        className="text-green-500 mt-0.5 flex-shrink-0"
                      />

                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => handlePayment(plan)}
                  disabled={processingPayment || !razorpayLoaded}
                  className={`mt-8 w-full py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                    processingPayment || !razorpayLoaded
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : plan.recommended
                        ? `
                          bg-gradient-to-r from-purple-600 to-violet-600
                          text-white
                          hover:from-purple-700
                          hover:to-violet-700
                          shadow-lg
                          hover:shadow-xl
                        `
                        : `
                          border border-purple-300
                          text-purple-600
                          hover:bg-purple-600
                          hover:text-white
                        `
                  }`}
                >
                  {processingPayment
                    ? "Processing..."
                    : `Purchase ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How Credits Work */}
        <div className="mt-16 bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">How Credits Work</h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            Each credit allows you to upload one file. For example, the Basic
            plan provides 100 credits, allowing you to upload up to 100 files.
            Once your credits are used, you can purchase another plan to add
            more credits to your account.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;

// import { AlertCircle, CreditCard } from "lucide-react";
// import UserCreditsContext from "../context/UserCreditsContext";
// import DashboardLayout from "../layout/DashboardLayout";
// import { useAuth } from "@clerk/clerk-react";
// import { useState, useContext, useRef, useEffect } from "react";
// const Subscription = () => {
//   const [processingPayment, setProcessingPayment] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("");
//   const [razorpayLoaded, setRazorpayLoaded] = useState(false);

//   const { getToken } = useAuth();
//   const razorpayScriptRef = useRef(null);
//   const { credits, setCredits, fetchCredits } = useContext(UserCreditsContext);

//   useEffect(() => {
//     if (!window.Razorpay) {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => {
//         console.log("Razorpay script loaded");
//         setRazorpayLoaded(true);
//       };
//       script.onerror = () => {
//         console.error("Failed to load Razorpay script");
//         setMessage("Failed to load Razorpay script. Please try again later.");
//         setMessageType("error");
//         setRazorpayLoaded(false);
//       };
//       document.body.appendChild(script);
//       razorpayScriptRef.current = script;
//     } else {
//       setRazorpayLoaded(true);
//     }

//     return () => {
//       if (razorpayScriptRef.current) {
//         document.body.removeChild(razorpayScriptRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const fetchUserCredits = async () => {
//       try {
//         const token = await getToken();
//         const response = await axios.get(
//           "http://localhost:8080/api/v1.0/users/credits",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );
//         setCredits(response.data.credits);
//       } catch (error) {
//         console.error("Error fetching user credits:", error);
//         setMessage("Failed to fetch user credits. Please try again later.");
//         setMessageType("error");
//       }
//     };

//     fetchUserCredits();
//   }, [getToken]);
//   const plans = [
//     {
//       id: "basic",
//       name: "Basic",
//       credits: 100,
//       price: 100,
//       features: [
//         "Upload up to 100 files",
//         "Access to basic features",
//         "Standard customer support",
//       ],
//       recommended: false,
//     },
//     {
//       id: "premium",
//       name: "Premium",
//       credits: 500,
//       price: 500,
//       features: [
//         "Upload up to 500 files",
//         "Access to all basic features",
//         "Priority customer support",
//       ],
//       recommended: false,
//     },
//     {
//       id: "ultimate",
//       name: "Ultimate",
//       credits: 2500,
//       price: 2000,
//       features: [
//         "Upload up to 2500 files",
//         "Access to all premium features",
//         "Priority customer support",
//         "Advanced analytics and reporting",
//       ],
//       recommended: true,
//     },
//   ];

//   return (
//     <DashboardLayout activeMenu="Subscription">
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-2">Subscription Plans</h1>
//         <p className="text-gray-600 mb-6">
//           Choose the perfect plan for your needs.
//         </p>
//         {message && (
//           <div
//             className={`p-4 mb-6  rounded-lg flex items-center gap-3 ${messageType === "error" ? "bg-red-50 text-red-700" : messageType === "success" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}
//           >
//             {messageType === "error" && <AlertCircle size={20} />}
//             {message}
//           </div>
//         )}
//         <div className="flex flex-col md:flex-row gap-6 mb-8">
//           <div className="bg-blue-50 p-6 rounded-lg">
//             <div className="flex items-center gap-2 mb-4">
//               <CreditCard className="text-purple-500" size={24} />
//               <h2 className="text-lg font-medium">
//                 Current Credits:{" "}
//                 <span className="font-bold text-purple-600">{credits}</span>
//               </h2>
//             </div>
//             <p className="text-sm text-gray-600 ml-2">
//               you can upload {credits} more files with your current credits.
//             </p>
//           </div>
//         </div>
//         <div className="grid md:grid-cols-2 gap-6">
//           {plans.map((plan) => (
//             <div
//               key={plan.id}
//               className={`border rounded-lg p-6 flex flex-col justify-between ${
//                 plan.recommended ? "border-purple-500" : "border-gray-300"
//               }`}
//             >
//               <div>
//                 <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
//                 <p className="text-gray-600 mb-4">
//                   {plan.credits} Credits - ₹{plan.price}
//                 </p>
//                 <ul className="mb-4">
//                   {plan.features.map((feature, index) => (
//                     <li key={index} className="text-gray-600">
//                       - {feature}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <button
//                 onClick={() => handlePayment(plan)}
//                 disabled={processingPayment || !razorpayLoaded}
//                 className={`mt-4 px-4 py-2 rounded-lg text-white ${
//                   processingPayment || !razorpayLoaded
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-purple-500 hover:bg-purple-600"
//                 }`}
//               >
//                 {processingPayment ? "Processing..." : "Subscribe"}
//               </button>
//             </div>
//           ))}
//         </div>
//         <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h3 className="font-medium mb-2">How Credits Works</h3>
//           <p className="text-sm text-gray-600">
//             Each plan provides a certain number of credits that can be used to
//             upload files. For example, if you have 100 credits, you can upload
//             100 files. Once your credits are used up, you will need to purchase
//             more credits to continue uploading files.
//           </p>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Subscription;
