
import React from 'react';
import { Card } from '../common/Card';
import { Icon } from '../common/Icon';

interface ResourceLinkProps {
    href: string;
    title: string;
    description: string;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({ href, title, description }) => (
    <li>
        <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-4 rounded-lg hover:bg-neutral-100 transition-colors"
        >
            <p className="font-semibold text-primary">{title}</p>
            <p className="text-sm text-neutral-600">{description}</p>
        </a>
    </li>
);

export const Resources: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Pusat Sumber HR</h2>
                <p className="text-neutral-500">Pautan pantas ke portal rasmi dan dokumen penting.</p>
            </div>

            <Card>
                <div className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Pautan Rasmi Agensi Kerajaan</h3>
                    <ul className="divide-y divide-neutral-200">
                        <ResourceLink 
                            href="https://www.kwsp.gov.my" 
                            title="Kumpulan Wang Simpanan Pekerja (KWSP / EPF)" 
                            description="Portal rasmi untuk semakan penyata, caruman, dan maklumat terkini mengenai simpanan persaraan anda."
                        />
                         <ResourceLink 
                            href="https://www.perkeso.gov.my" 
                            title="Pertubuhan Keselamatan Sosial (PERKESO / SOCSO)" 
                            description="Maklumat mengenai skim perlindungan keselamatan sosial termasuk faedah kemalangan, hilang upaya, dan Sistem Insurans Pekerjaan (SIP)."
                        />
                         <ResourceLink 
                            href="https://www.hasil.gov.my" 
                            title="Lembaga Hasil Dalam Negeri Malaysia (LHDN / IRB)" 
                            description="Portal rasmi untuk semua urusan berkaitan cukai pendapatan, termasuk e-Filing, semakan PCB, dan panduan pelepasan cukai."
                        />
                    </ul>
                </div>
            </Card>

             <Card>
                <div className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Dokumen & Jadual Rujukan</h3>
                     <ul className="divide-y divide-neutral-200">
                        <ResourceLink 
                            href="https://www.kwsp.gov.my/ms/employer/contribution/contribution-rate" 
                            title="Jadual Kadar Caruman KWSP" 
                            description="Lihat jadual penuh kadar caruman wajib untuk pekerja dan majikan berdasarkan julat gaji."
                        />
                         <ResourceLink 
                            href="https://www.perkeso.gov.my/ms/kadar-caruman" 
                            title="Jadual Kadar Caruman PERKESO & EIS" 
                            description="Jadual caruman untuk Skim Bencana Pekerjaan, Skim Keilatan, dan Sistem Insurans Pekerjaan (EIS)."
                        />
                    </ul>
                </div>
            </Card>
        </div>
    );
};
