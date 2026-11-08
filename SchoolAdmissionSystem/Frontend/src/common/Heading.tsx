type HeadingProps = {
  upper_subtitle: string;
  title: string;
  subtitle: string;
};

function Heading({ upper_subtitle, title, subtitle }: HeadingProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-semibold text-indigo-700">
        {upper_subtitle}
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        {subtitle}
      </p>
    </div>
  );
}

export default Heading;
