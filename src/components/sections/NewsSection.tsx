import { getNews } from "@/lib/news";
import Link from "next/link";
import Image from "next/image";
import { HiArrowRight, HiCalendar, HiNewspaper } from "react-icons/hi2";
import { format } from "date-fns";

export async function NewsSection() {
    const news = await getNews(6);

    if (news.length === 0) {
        return null;
    }

    return (
        <section id="news" className="relative py-24 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full blur-3xl translate-y-1/2" />

            <div className="relative mx-auto max-w-7xl px-6">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                        </span>
                        Latest Updates
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
                        News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Announcements</span>
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Stay informed about the latest activities, reports, and updates from the Woreda Inspection and Ethics Commission.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <Link
                            key={item.id}
                            href={`/news/${item.id}`}
                            className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                                {item.cover_image_url ? (
                                    <Image
                                        src={item.cover_image_url}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <HiNewspaper className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
                                    <HiCalendar className="w-3.5 h-3.5 text-blue-600" />
                                    {item.published_at ? format(new Date(item.published_at), "MMM d, yyyy") : "Draft"}
                                </div>
                            </div>

                            <div className="flex-1 p-6 md:p-8 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed">
                                    {item.summary || item.content}
                                </p>

                                <div className="flex items-center text-sm font-bold text-blue-600 mt-auto group/btn">
                                    Read Article
                                    <HiArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
