interface ContactInfoProps {
    icon: React.ReactNode;
    info: string;
    href?: string;
  }
  
  export default function ContactInfo({ icon, info, href }: ContactInfoProps) {
    return (
      <div className="flex items-center space-x-2">
        {icon}
        {href ? (
          <a href={href} className="text-gray-300 hover:text-green-400 transition-colors duration-300">
            {info}
          </a>
        ) : (
          <span className="text-gray-300">{info}</span>
        )}
      </div>
    );
  }
  