import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  useState,
  type FormEvent,
} from "react";

import {
  createApplication,
} from "@/services/applications.service";

import "@/styles/job-application.css";


export const Route = createFileRoute(
  "/jobs/$jobId/apply",
)({
  component: ApplyPage,
});


function ApplyPage() {

  const { jobId } =
    Route.useParams();


  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [resume, setResume] =
    useState<File | null>(null);

  const [message, setMessage] =
    useState("");


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    try {

      setMessage("");


      if (!resume) {
        setMessage(
          "Please upload your resume.",
        );

        return;
      }


      await createApplication({

        jobId: Number(jobId),

        fullName,

        email,

        phone,

        resumeName:
          resume.name,

      });


      setMessage(
        "Application submitted successfully!",
      );


      setFullName("");
      setEmail("");
      setPhone("");
      setResume(null);


    } catch (error) {

      console.error(
        error,
      );


      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit application.",
      );

    }

  }



  return (

    <main className="job-application-page">

      <div className="job-application-container">


        <section className="job-application-card">


          <h1>
            Apply for Job
          </h1>


          <p>
            Job ID: {jobId}
          </p>



          <form
            onSubmit={handleSubmit}
          >


            <label>
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              required
              onChange={(e)=>
                setFullName(
                  e.target.value
                )
              }
            />



            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              required
              onChange={(e)=>
                setEmail(
                  e.target.value
                )
              }
            />



            <label>
              Phone
            </label>

            <input
              type="text"
              value={phone}
              required
              onChange={(e)=>
                setPhone(
                  e.target.value
                )
              }
            />



            <label>
              Resume
            </label>


            <input
              type="file"
              accept=".pdf,.doc,.docx"
              required
              onChange={(e)=>
                setResume(
                  e.target.files?.[0] ?? null
                )
              }
            />



            <button
              type="submit"
            >
              Submit Application
            </button>


          </form>



          {message && (

            <p className="application-message">
              {message}
            </p>

          )}


        </section>


      </div>


    </main>

  );

}