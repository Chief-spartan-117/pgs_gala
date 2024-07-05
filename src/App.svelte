<script>
  // import { Router } from "@roxi/routify";
  // import { routes } from "../.routify/routes";
  import { Router, Link, Route } from "svelte-routing";
  import Form from "./components/Form.svelte";
  import Main from "./components/Main.svelte";
  import galaLogo from "./assets/img/logo.png";
</script>

<Router>
  <!-- <header
    class="mx-16 my-3 rounded-full border border-slate-200 px-2 py-2 max-md:mx-4 max-md:px-1 max-md:py-2"
  >
    <nav class="flex items-center justify-between gap-8 max-md:gap-4">
      <div>
        <Link to="/">
          <img
            src={galaLogo}
            alt="PGS Gala Logo"
            class="ml-4 w-36 max-md:ml-1 max-md:w-24"
          />
        </Link>
      </div>
      <div>
        <ul class="flex items-center gap-8 max-md:gap-2 max-md:text-sm">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link
              to="/register"
              class="rounded-full bg-orange-400 px-6 py-3 font-bold text-white max-md:text-nowrap max-md:px-4 max-md:py-2"
              >Register Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  </header> -->

  <Route path="/"><Main /></Route>
  <Route path="/register"><Form></Form></Route>
</Router>
