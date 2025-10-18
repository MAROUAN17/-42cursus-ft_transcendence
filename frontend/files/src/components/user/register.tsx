import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import Setup2FA from "./setup2FA";
import api from "../../axios";
import axios from "axios";

function Register() {
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameErrorMssg, setUsernameErrorMssg] = useState<string>("");
  const [usernameErrorFlag, setUsernameErrorFlag] = useState<boolean>(false);
  const [passErrorMssg, setPassErrorMssg] = useState<string>("");
  const [passErrorFlag, setPassErrorFlag] = useState<boolean>(false);
  const [emailErrorMssg, setEmailErrorMssg] = useState<string>("");
  const [emailErrorFlag, setEmailErrorFlag] = useState<boolean>(false);
  const [termsErrorMssg, setTermsErrorMssg] = useState<string>("");
  const [termsErrorFlag, setTermsErrorFlag] = useState<boolean>(false);
  const navigate = useNavigate();
  const termsRef = useRef<HTMLInputElement>(null);

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!termsRef.current?.checked) {
      setTermsErrorFlag(true);
      setTermsErrorMssg("Please agree on terms and conditions");
      return;
    }

    api
      .post("/register/verify", {
        username: username,
        email: email,
        password: password,
        terms: termsRef.current?.checked,
      })
      .then(function () {
        axios
          .post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
            username: username,
            email: email,
            password: password,
            terms: termsRef.current?.checked,
          })
          .then(function (res) {
            navigate("/login");
          })
          .catch(function (err) {
            console.log(err);
          });
      })
      .catch(function (err) {
        if (err.response.data.error.includes("Username")) {
          setUsernameErrorFlag(true);
          setUsernameErrorMssg(err.response.data.error);
        }
        if (err.response.data.error.includes("Email")) {
          setEmailErrorFlag(true);
          setEmailErrorMssg(err.response.data.error);
        }
        if (err.response.data.error.includes("Password")) {
          setPassErrorFlag(true);
          setPassErrorMssg(err.response.data.error);
        }
      });
  };

  const emailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmailErrorFlag(false);
    setEmail(e.target.value);
  };

  const passInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPassErrorFlag(false);
    setPassword(e.target.value);
  };

  const usernameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUsernameErrorFlag(false);
    setUsername(e.target.value);
  };

  return (
    <div className="relative">
      {policyOpen ? (
        <div className="absolute p-6 font-poppins flex flex-col justify-center items-center text-white rounded-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#14095c] w-1/3 h-1/2">
          <div className="h-full w-full px-5 my-6 overflow-y-auto scrollbar scrollbar-thumb-neon/80 scrollbar-track-white/10">
            <h1 className="font-bold text-[25px]">Privacy Policy</h1>
            <hr />
            <p className="font-semibold mb-4">Last updated: 11/10/2025</p>
            <p>
              At <span className="font-semibold text-neon">NeonPong</span>, we respect your privacy and are committed to protecting your personal
              data. This policy explains how we collect, use, store, and protect the information you provide when using our multiplayer ping-pong app.
            </p>

            <h2 className="font-bold underline text-[20px]">1. Who we are</h2>
            <p>
              The data controller is: <span className="font-semibold">NeonPong</span>
              <br />
              Email: <a href="#">neonpingpong17@gmail.com</a>
              <br />
              Address: 1337, Khouribga, E1 hh
            </p>

            <h2 className="font-bold underline text-[20px]">2. What we collect</h2>
            <p>We collect only the minimum data needed to operate the service:</p>
            <ul>
              <li>
                <span className="font-semibold">Username</span> — used to identify you in the app and on leaderboards.
              </li>
              <li>
                <span className="font-semibold">Email address</span> — used for login, account recovery, and important communications.
              </li>
              <li>
                <span className="font-semibold">Game statistics</span> — scores, match results, rankings and related data used to build leaderboards
                and matchmaking.
              </li>
            </ul>

            <h2 className="font-bold underline text-[20px]">3. How we use your information</h2>
            <p>We use your data to provide and improve the service:</p>
            <ul>
              <li>Create and manage your account and authentication.</li>
              <li>Display your performance and ranking on leaderboards.</li>
              <li>Send important account-related notices (security, password reset).</li>
            </ul>

            <h2 className="font-bold underline text-[20px]">4. Legal basis for processing</h2>
            <p>We process your data under the following legal grounds:</p>
            <ul>
              <li>
                <span className="font-semibold">Contractual necessity</span> — so we can provide the core features of the service (accounts, gameplay,
                leaderboards).
              </li>
              <li>
                <span className="font-semibold">Legitimate interests</span> — to secure the platform, prevent abuse, and improve user experience.
              </li>
              <li>
                <span className="font-semibold">Consent</span> — for optional features where you explicitly opt in (for example: newsletters or
                marketing).
              </li>
            </ul>

            <h2 className="font-bold underline text-[20px]">5. Data retention</h2>
            <p>We retain personal data only while your account is active or as required to provide the service. If you delete your account:</p>
            <ul>
              <li>
                Your <span className="font-semibold">email</span> and <span className="font-semibold">username</span> will be anonymized or
                permanently deleted.
              </li>
              <li>Game records or leaderboard data may remain in anonymized or aggregated form to preserve ranking integrity and for analytics.</li>
              <li>
                Chat messages or interactions may be retained as <em>"Deleted User"</em> entries so other users’ histories remain intact.
              </li>
            </ul>

            <h2 className="font-bold underline text-[20px]">6. Your rights</h2>
            <p>Under the GDPR you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction or deletion of your personal data.</li>
              <li>Request a portable copy of your personal data (data portability).</li>
            </ul>
            <p>
              To exercise any of these rights, You can Edit, Delete your Account or Download a copy of your personal data directly from your profile
              settings.
            </p>

            <h2 className="font-bold underline text-[20px]">7. Data security</h2>
            <p>
              We use reasonable technical and organizational measures to protect your data (encryption in transit, secure database storage, access
              controls). However, no system can be guaranteed 100% secure — please keep your login credentials private and use a span password.
            </p>

            <h2 className="font-bold underline text-[20px]">8. Sharing with third parties</h2>
            <p>
              We do not sell or rent your personal data. We only share data when necessary for core operation (hosting, backups) or when required by
              law. Any third-party service providers we use are required to comply with data protection standards (including GDPR where applicable).
            </p>

            <h2 className="font-bold underline text-[20px]">9. International transfers</h2>
            <p>
              If we transfer data outside the European Economic Area (EEA), we will ensure appropriate safeguards are in place (for example, standard
              contractual clauses) to protect your data.
            </p>

            <h2 className="font-bold underline text-[20px]">10. Cookies</h2>
            <p>
              We may use cookies and similar technologies for session management and basic analytics. You can control or disable cookies through your
              browser settings — note that disabling certain cookies may affect functionality.
            </p>

            <h2 className="font-bold underline text-[20px]">11. Changes to this policy</h2>
            <p>We may update this policy from time to time. The updated version and the “Last updated” date will be published on this page.</p>

            <h2 className="font-bold underline text-[20px]">12. Contact</h2>
            <p>
              If you have questions or want to make a data request, contact us at:
              <br />
              <span className="font-semibold">Email:</span> <a href="#">neonpingpong17@gmail.com</a>
              <br />
              <span className="font-semibold">Address:</span> 1337, Khouribga
            </p>

            <p>
              This Privacy Policy is intended as a clear, high-level explanation. It does not create contractual or other legal rights beyond those
              established by applicable privacy laws.
            </p>
          </div>
          <button onClick={() => setPolicyOpen(false)} className="bg-neon px-4 py-1 text-[18px] font-bold rounded-md">
            Back
          </button>
        </div>
      ) : null}

      <div
        className={`relative flex justify-between font-poppins h-screen bg-gameBg overflow-hidden items-center ${
          policyOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="xl:py-[260px] xl:px-[300px] xl:mt-12 lg:mt-24 w-1/2 lg:px-[220px]">
          <div className="">
            <h1 className="text-white text-center xl:text-9xl lg:text-8xl font-bold">SIGNUP</h1>
            <p className="text-white text-center text-xl py-2 font-light">Join and have fun with your friends</p>
          </div>
          <form onSubmit={handleForm}>
            <div className="xl:my-20 lg:my-14 flex flex-col gap-10">
              <div>
                <label className="flex text-gray-300">Username</label>
                <input
                  value={username}
                  onChange={usernameInput}
                  required
                  className={`text-white bg-transparent ${usernameErrorFlag ? "border-b border-red-700" : "border-b border-white"} py-4 mt-5 w-full`}
                  id="username"
                  type="text"
                  placeholder="Username"
                />
                {usernameErrorFlag && <p className="mt-3 text-red-500">{usernameErrorMssg}</p>}
              </div>
              <div>
                <label className="flex text-gray-300">Email</label>
                <input
                  value={email}
                  onChange={emailInput}
                  required
                  className={`text-white bg-transparent ${emailErrorFlag ? "border-b border-red-700" : "border-b border-white"}  py-4 mt-5 w-full`}
                  id="email"
                  type="email"
                  placeholder="Email"
                />
                {emailErrorFlag && <p className="mt-3 text-red-500">{emailErrorMssg}</p>}
              </div>
              {/* this is the password input */}
              <div className="">
                <label className="flex text-gray-300">Password</label>
                <div className="flex items-center mt-5">
                  <input
                    value={password}
                    onChange={passInput}
                    required
                    className={`text-white bg-transparent ${passErrorFlag ? "border-b border-red-700" : "border-b border-white"}  py-4 w-full`}
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                </div>
                {passErrorFlag && <p className="mt-3 text-red-500">{passErrorMssg}</p>}
              </div>
              {/* login button */}
              <div className="flex flex-nowrap justify-between">
                <div className="flex space-x-3 w-full items-center">
                  <input
                    type="checkbox"
                    ref={termsRef}
                    className={`${
                      termsErrorFlag ? "border-red-500" : null
                    } w-4 h-4 appearance-none border-2 border rounded-full checked:bg-gray-300 transition ease-in-out`}
                  />
                  <p className="text-white xl:text-base lg:text-sm whitespace-nowrap">
                    I accept the{" "}
                    <span onClick={() => setPolicyOpen(true)} className="underline text-blue-500">
                      terms and conditions
                    </span>
                  </p>
                </div>
                <button className="px-12 py-4 rounded-xl text-white bg-neon font-bold shadow-neon">REGISTER</button>
              </div>
              {termsErrorFlag ? <h1 className="mt-[-40px] text-red-500">{termsErrorMssg}</h1> : null}

              {/* login with others section */}
              <div className="flex justify-between items-center">
                <hr className="xl:w-[35%] lg:w-[30%]"></hr>
                <h1 className="text-white">Login with others</h1>
                <hr className="xl:w-[35%] lg:w-[30%]"></hr>
              </div>
              <div className="flex justify-center">
                <img className="w-[32px] h-[32px]" src="/42-icon.png" alt="42 icon" />
              </div>
              <div className="flex justify-center">
                <h1 className="text-white font-light">
                  Already have an account?{" "}
                  <span className="font-bold">
                    <a href="/login" className="href">
                      Login
                    </a>
                  </span>
                </h1>
              </div>
            </div>
          </form>
        </div>
        <div className="xl:w-[50%] overflow-hidden lg:w-1/2">
          <img src="/login-page.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Register;
