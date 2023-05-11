import Image from "next/image";

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <footer className={className}>
      <a
        className={"link"}
        href="https://tidbcloud.com/?utm_source=smartchart&utm_medium=referral"
        target="_blank"
        rel="noopener noreferrer"
        data-mp-event="Click TiDB Cloud Site Link"
      >
        Powered by{" "}
        <Image
          src="/tidb.svg"
          alt="TiDB Cloud Logo"
          width={138}
          height={24}
          priority
        />
      </a>
    </footer>
  );
};
