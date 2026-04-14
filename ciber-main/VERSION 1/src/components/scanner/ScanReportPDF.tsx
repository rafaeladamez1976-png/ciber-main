'use client';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Scan } from '@/types/scan';

// Font registration (standard fonts don't support all characters well)
// Font.register({ family: 'Inter', src: '...' }); // Optional

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        borderBottomWidth: 2,
        borderBottomColor: '#00ff88',
        paddingBottom: 20,
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00ff88',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#111827',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 30,
    },
    scoreSection: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    scoreCard: {
        padding: 20,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#111827',
    },
    scoreLabel: {
        fontSize: 10,
        color: '#6b7280',
        marginTop: 5,
        textTransform: 'uppercase',
    },
    riskBadge: {
        padding: '4 12',
        borderRadius: 4,
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 15,
        marginTop: 20,
        textTransform: 'uppercase',
        borderLeftWidth: 4,
        borderLeftColor: '#00ff88',
        paddingLeft: 10,
    },
    finding: {
        padding: 15,
        marginBottom: 10,
        backgroundColor: '#f9fafb',
        borderRadius: 6,
        borderLeftWidth: 4,
    },
    findingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    findingTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
    },
    findingSeverity: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    findingSource: {
        fontSize: 9,
        color: '#6b7280',
        marginBottom: 8,
    },
    findingDesc: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.4,
    },
    findingRec: {
        fontSize: 10,
        color: '#059669',
        marginTop: 8,
        fontStyle: 'italic',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        fontSize: 8,
        color: '#9ca3af',
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingTop: 10,
    }
});

interface ScanReportPDFProps {
    scan: Scan;
}

export default function ScanReportPDF({ scan }: ScanReportPDFProps) {
    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#fbbf24';
            case 'low': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.logo}>SIAR-C</Text>
                    <Text style={{ fontSize: 10, color: '#6b7280' }}>
                        {new Date().toLocaleDateString('es-ES')}
                    </Text>
                </View>

                <Text style={styles.title}>Informe de Seguridad</Text>
                <Text style={styles.subtitle}>Análisis completo para: {scan.target}</Text>

                <View style={styles.scoreSection}>
                    <View style={styles.scoreCard}>
                        <Text style={styles.scoreValue}>{scan.score}</Text>
                        <Text style={styles.scoreLabel}>Score de Seguridad</Text>
                        <View style={[styles.riskBadge, { backgroundColor: getSeverityColor(scan.risk_level || 'info') }]}>
                            <Text>RIESGO {(scan.risk_level || 'info').toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1.5, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>
                            Este informe detalla las vulnerabilidades encontradas durante el escaneo automático realizado por la plataforma SIAR-C.
                            El análisis cubre reputación de dominio, configuración SSL/TLS, encabezados de seguridad HTTP y filtraciones de datos.
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Hallazgos Principales</Text>

                {scan.findings.map((f, i) => (
                    <View key={i} style={[styles.finding, { borderLeftColor: getSeverityColor(f.severity) }]}>
                        <View style={styles.findingHeader}>
                            <Text style={styles.findingTitle}>{f.title}</Text>
                            <Text style={[styles.findingSeverity, { color: getSeverityColor(f.severity) }]}>
                                {f.severity.toUpperCase()}
                            </Text>
                        </View>
                        <Text style={styles.findingSource}>Fuente: {f.source} | Categoría OWASP: {f.owasp_category || 'N/A'}</Text>
                        <Text style={styles.findingDesc}>{f.description}</Text>
                        <Text style={styles.findingRec}>Recomendación: {f.recommendation}</Text>
                    </View>
                ))}

                {scan.findings.length === 0 && (
                    <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: '#6b7280' }}>
                        No se han detectado vulnerabilidades críticas en este análisis.
                    </Text>
                )}

                <Text style={styles.footer}>
                    INFORME GENERADO POR SIAR-C | CONFIDENCIALIDAD NIVEL ALTO | © {new Date().getFullYear()}
                </Text>
            </Page>
        </Document>
    );
}
