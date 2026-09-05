/** Five concentric circles, scaled uniformly to keep their shared center. */
export function IllustrationRings() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 600 600"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[115%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 text-primary"
      fill="none"
    >
      {[110, 155, 200, 245, 290].map((radius, index) => (
        <circle key={radius} cx="300" cy="300" r={radius} stroke="currentColor" strokeOpacity={[0.2, 0.15, 0.12, 0.1, 0.08][index]} />
      ))}
    </svg>
  );
}
