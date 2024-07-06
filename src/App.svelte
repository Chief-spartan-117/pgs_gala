<script>
  // import { Router } from "@roxi/routify";
  // import { routes } from "../.routify/routes";
  import { Router, Link, Route } from "svelte-routing";
  import Form from "./components/Form.svelte";
  import Main from "./components/Main.svelte";
  import galaLogo from "./assets/img/PBS long logo.png";
</script>

<div class="h-screen bg-[rgb(5_16_58)]">
  <Router>
    <header
      class="fixed top-0 z-20 mb-3 w-full px-16 pb-2 pt-6 max-lg:px-8
       max-md:flex max-md:w-full max-md:px-4"
       style="backdrop-filter: blur(20px);"
    >
      <nav class="flex w-full items-center justify-between gap-8 max-md:gap-4">
        <div>
          <Link to="/">
            <img
              src={galaLogo}
              alt="PGS Gala Logo"
              class="ml-4 w-44 max-md:ml-1 max-md:w-28 max-sm:w-28"
            />
          </Link>
        </div>
        <div>
          <ul class="flex items-center gap-8 max-md:gap-2 max-md:text-sm">
            <li>
              <Link
                to="/register"
                class="rounded-md bg-orange-500 px-6 py-3 font-bold text-white max-md:text-nowrap max-md:px-4 max-md:py-2"
                >Register Now
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <Route path="/"><Main /></Route>
    <Route path="/register"><Form></Form></Route>
  </Router>
</div>

<!-- <style>
  .dotbg {
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.3) 6%,
      transparent 0
    );
    background-size: 20px 20px;
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    mask-image: radial-gradient(
      55% 60% at 50% 50%,
      rgba(170, 91, 12, 0.2) 70%,
      rgba(99, 57, 11, 0.8) 100%
    );
  }
</style> -->
