import { motion } from "framer-motion";
import Link from "next/link";

interface Vote {
  openingId: string;
  userId: string;
  vote: number;
}

interface Opening {
  _id: string;
  title: string;
  url: string;
}

interface OpeningTableProps {
  ops: Opening[];
  page: number;
  votes: Vote[];
  pageSize: number;
}

const OpeningsTable: React.FC<OpeningTableProps> = ({
  ops,
  votes,
  page,
  pageSize,
}) => {
  function handleVote(opId: string) {
    const vote = votes.find((vote) => vote.openingId === opId);
    if (vote) {
      return (
        <span className="bg-green-600 font-semibold text-white rounded-xl py-1 px-2">
          {vote.vote}
        </span>
      );
    } else {
      return (
        <span className="bg-gray-500 text-white rounded-xl py-1 px-2">
          Sin votar
        </span>
      );
    }
  }
  const rowVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full rounded-xl">
      <table className="w-full bg-gray-50 rounded-xl shadow-xl">
        <thead className="bg-blue-500 text-white text-xl rounded-xl">
          <tr className="rounded-xl">
            <th className="w-3/4 text-left p-4 rounded-tl-lg">
              Nombre del Anime
            </th>
            <th className="w-1/4 border-l-2 border-white border-opacity-10 rounded-tr-lg">
              Puntuación
            </th>
          </tr>
        </thead>

        <tbody className="divide-y text-lg">
          {ops
            ?.slice((page - 1) * pageSize, page * pageSize)
            .map((op: Opening, i) => (
              <motion.tr
                key={op._id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={rowVariants}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <td
                  className={`px-4 py-3 ${
                    i == pageSize - 1 ? "rounded-bl-lg" : ""
                  } max-w-full truncate whitespace-nowrap overflow-hidden`}
                  style={{ maxWidth: "255px" }}
                >
                  <Link className="text-blue-400" href={`/${op._id}`}>
                    {op.title}
                  </Link>
                </td>
                <td
                  className={`text-center ${
                    i == pageSize - 1 ? "rounded-br-lg" : ""
                  }`}
                >
                  {handleVote(op._id)}
                </td>
              </motion.tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpeningsTable;
