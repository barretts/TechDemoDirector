/**
 * Output formatter for CLI commands.
 *
 * Every command in this CLI supports two output modes:
 * - Human-readable (colored, formatted for terminal)
 * - JSON (structured, for agent consumption)
 *
 * Use this class to keep formatting consistent across commands.
 * Extend with domain-specific formatters as you add commands.
 */
export declare class OutputFormatter {
    static formatJson(data: unknown): string;
    static formatTable(headers: string[], rows: string[][], columnWidths?: number[]): string;
    static formatKeyValue(pairs: Record<string, string | number | boolean>): string;
}
//# sourceMappingURL=output-formatter.d.ts.map