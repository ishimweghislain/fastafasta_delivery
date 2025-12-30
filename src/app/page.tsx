import Link from "next/link";
import { ArrowRight, Search, Sparkles, Star, Truck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/30 blur-3xl" />
          <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-160 rounded-full bg-fuchsia-500/15 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-2 md:py-20">
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/10">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              Fresh. Fast. Reliable.
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Order food that feels
              <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                {' '}premium
              </span>
              {' '}— delivered fast.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
              Discover restaurants near you, save favorites, and checkout in seconds.
              Designed to look beautiful, feel smooth, and work like a real product.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/restaurants"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Browse restaurants
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/favorites"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/10"
              >
                Your favorites
                <Star className="h-4 w-4 text-amber-300" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Truck className="h-4 w-4 text-emerald-300" />
                  Fast delivery
                </div>
                <p className="mt-1 text-sm text-zinc-300">Smooth checkout and quick handoff.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Star className="h-4 w-4 text-amber-300" />
                  Top-rated menus
                </div>
                <p className="mt-1 text-sm text-zinc-300">Food that looks as good as it tastes.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Search className="h-4 w-4 text-indigo-300" />
                  Smart discovery
                </div>
                <p className="mt-1 text-sm text-zinc-300">Find meals by vibe, price, or cravings.</p>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-bottom-6 duration-700 md:delay-150">
            <div className="relative overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10">
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/10 via-transparent to-indigo-500/10" />
              <div className="grid grid-cols-2 gap-0">
                <div className="p-6">
                  <div className="text-sm font-semibold text-white">Today’s vibe</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-100">Get Your Order Now !!</div>
                  <p className="mt-2 text-sm text-zinc-300">Burgers, fries, and midnight snacks.</p>
                </div>
                <div className="relative h-44 md:h-52">
                  <img
                    src="/images/food.png"
                    alt="Food"
                    className="h-full w-full object-contain p-6 drop-shadow-xl transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="relative h-44 md:h-52">
                  <img
                    src="/images/delivery.png"
                    alt="Delivery"
                    className="h-full w-full object-contain p-6 drop-shadow-xl transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm font-semibold text-white">Always on time</div>
                  <div className="mt-1 text-2xl font-semibold text-zinc-100">30–45 mins</div>
                  <p className="mt-2 text-sm text-zinc-300">A delivery experience that feels premium.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="group rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10">
                <div className="text-sm font-semibold text-white">Explore restaurants</div>
                <p className="mt-1 text-sm text-zinc-300">Browse menus with beautiful cards and hovers.</p>
                <div className="mt-4 text-sm font-semibold text-emerald-200 transition group-hover:translate-x-0.5">
                  Go now →
                </div>
              </div>
              <div className="group rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:bg-white/10">
                <div className="text-sm font-semibold text-white">Admin dashboard</div>
                <p className="mt-1 text-sm text-zinc-300">Manage restaurants, orders, and staff.</p>
                <div className="mt-4 text-sm font-semibold text-indigo-200 transition group-hover:translate-x-0.5">
                  Login →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
          <div className="text-sm text-zinc-400">© {new Date().getFullYear()} FastaFasta</div>
          <div className="text-sm text-zinc-400">Delivering happiness, one meal at a time.</div>
        </div>
      </footer>
    </main>
  );
}
