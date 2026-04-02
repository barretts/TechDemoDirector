#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { validateOutlineCommand } from './commands/validate-outline.js';
import { scanRepoCommand } from './commands/scan.js';
import { extractSequenceCommand } from './commands/extract-sequence.js';
import { paceCommand } from './commands/pace.js';
import { preflightCommand } from './commands/preflight.js';
import { rehearseCommand } from './commands/rehearse.js';
import { AppError } from '../errors/types.js';

const program = new Command()
  .name('presentation-util')
  .version('1.0.0', '-v, --version')
  .description('Companion CLI for the presentation-creator skill');

// ---- Command: validate-outline ----

program
  .command('validate-outline')
  .description('Validate a presentation outline: check OPEN paths, line ranges, SAY blocks, time budgets')
  .argument('<outline>', 'Path to the presentation outline markdown file')
  .option('--json', 'Output as JSON', false)
  .option('--basedir <dir>', 'Base directory for resolving OPEN paths')
  .option('--skip-file-checks', 'Skip filesystem existence checks', false)
  .action(async (outline: string, options) => {
    try {
      const result = await validateOutlineCommand({
        outlinePath: outline,
        basedir: options.basedir,
        skipFileChecks: options.skipFileChecks,
        json: options.json,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log();
        if (result.valid) {
          console.log(chalk.green.bold('  VALID') + '  ' + result.filePath);
        } else {
          console.log(chalk.red.bold('  INVALID') + '  ' + result.filePath);
        }
        console.log();

        for (const issue of result.issues) {
          const color = issue.severity === 'error' ? chalk.red : chalk.yellow;
          console.log(`  ${color(issue.severity.toUpperCase().padEnd(7))} line ${String(issue.line).padEnd(4)} [${issue.rule}] ${issue.message}`);
        }

        if (result.issues.length > 0) console.log();

        console.log(chalk.gray(`  Stats: ${result.stats.sections} sections, ${result.stats.opens} opens, ${result.stats.says} says`));
        if (result.stats.totalTimeBudget !== null) {
          console.log(chalk.gray(`  Time budget: ${result.stats.totalTimeBudget} min` +
            (result.stats.declaredDuration ? ` (declared: ${result.stats.declaredDuration} min)` : '')));
        }
        console.log();
      }
    } catch (error) {
      handleError(error);
    }
  });

// ---- Command: scan-repo ----

program
  .command('scan-repo')
  .description('Scan a codebase and produce structured data for building a presentation')
  .option('--json', 'Output as JSON', false)
  .option('--cwd <dir>', 'Repository root directory', process.cwd())
  .option('--max-depth <n>', 'Maximum directory traversal depth', '10')
  .option('--extensions <exts>', 'Comma-separated file extensions to include (e.g. .ts,.py)')
  .action(async (options) => {
    try {
      const extensions = options.extensions
        ? options.extensions.split(',').map((e: string) => e.trim().startsWith('.') ? e.trim() : `.${e.trim()}`)
        : undefined;

      const result = await scanRepoCommand({
        cwd: options.cwd,
        json: options.json,
        maxDepth: parseInt(options.maxDepth, 10),
        extensions,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log();
        console.log(chalk.bold(`Repo: ${result.root}`));
        console.log(chalk.gray(`  ${result.totalFiles} files, ${result.totalLines} lines`));
        console.log();

        // Language breakdown
        console.log(chalk.bold('  Languages:'));
        for (const [ext, info] of Object.entries(result.languageBreakdown)) {
          console.log(`    ${ext.padEnd(8)} ${String(info.files).padStart(4)} files  ${String(info.lines).padStart(6)} lines`);
        }
        console.log();

        // Entry points
        if (result.entryPoints.length > 0) {
          console.log(chalk.bold('  Entry Points:'));
          for (const ep of result.entryPoints) {
            console.log(`    ${ep.relativePath} ${chalk.gray(`(${ep.entryPointReason})`)}`);
          }
          console.log();
        }

        // Aha candidates
        if (result.ahaCandidates.length > 0) {
          console.log(chalk.bold('  "Aha" Candidates (high-connectivity files):'));
          for (const aha of result.ahaCandidates.slice(0, 10)) {
            console.log(`    ${chalk.cyan(aha.file)} ${chalk.gray(`score:${aha.score} — ${aha.reason}`)}`);
          }
          console.log();
        }
      }
    } catch (error) {
      handleError(error);
    }
  });

// ---- Command: extract-sequence ----

program
  .command('extract-sequence')
  .description('Extract the ordered file:line open sequence from a presentation outline')
  .argument('<outline>', 'Path to the presentation outline markdown file')
  .option('--json', 'Output as JSON', false)
  .action(async (outline: string, options) => {
    try {
      const result = await extractSequenceCommand({
        outlinePath: outline,
        json: options.json,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log();
        console.log(result.markdown);
        console.log();
        console.log(chalk.gray(`${result.totalOpens} opens across ${result.uniqueFiles.length} unique files`));
        console.log();
      }
    } catch (error) {
      handleError(error);
    }
  });

// ---- Command: pace ----

program
  .command('pace')
  .description('Calculate time budgets for presentation sections')
  .requiredOption('--duration <minutes>', 'Total talk duration in minutes')
  .requiredOption('--sections <list>', 'Comma-separated sections: "Intro,!Demo:2,=Recap:3" (! = protected, = = fixed, :N = weight)')
  .option('--buffer <fraction>', 'Buffer fraction of total time (default 0.1)', '0.1')
  .option('--wpm <rate>', 'Speaking rate in words/min (default 130)', '130')
  .option('--json', 'Output as JSON', false)
  .action((options) => {
    try {
      const result = paceCommand({
        duration: parseFloat(options.duration),
        sections: options.sections,
        buffer: parseFloat(options.buffer),
        wpm: parseInt(options.wpm, 10),
        json: options.json,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log();
        console.log(chalk.bold(`Pacing Plan — ${result.totalMinutes} min total (${result.bufferMinutes} min buffer)`));
        console.log();

        for (const s of result.sections) {
          const prot = s.protected ? chalk.green(' [protected]') : '';
          const trim = s.trimTarget > 0 ? chalk.gray(` trim: -${s.trimTarget}m`) : '';
          console.log(`  ${s.name.padEnd(24)} ${String(s.minutes + 'm').padStart(6)}  ~${s.approxWords} words  ~${s.approxPairs} pairs${prot}${trim}`);
        }

        console.log();
        console.log(chalk.gray(`  Total words: ~${result.totalWords} at ${result.wordsPerMinute} WPM`));

        for (const w of result.warnings) {
          console.log(chalk.yellow(`  Warning: ${w}`));
        }
        console.log();
      }
    } catch (error) {
      handleError(error);
    }
  });

// ---- Command: preflight ----

program
  .command('preflight')
  .description('Generate a pre-call readiness checklist')
  .option('--json', 'Output as JSON', false)
  .option('--no-remote', 'In-person presentation (skip remote-specific checks)')
  .option('--live-coding', 'Include live coding/terminal demo checks', false)
  .option('--duration <minutes>', 'Talk duration in minutes', '25')
  .option('--audience <type>', 'Audience type: technical, mixed, non-technical', 'technical')
  .option('--recorded', 'Presentation will be recorded', false)
  .action((options) => {
    try {
      const result = preflightCommand({
        remote: options.remote,
        liveCoding: options.liveCoding,
        duration: parseInt(options.duration, 10),
        audience: options.audience as 'technical' | 'mixed' | 'non-technical',
        recorded: options.recorded,
        json: options.json,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log();
        console.log(chalk.bold('Pre-Flight Checklist'));
        console.log();

        let lastCategory = '';
        for (const item of result.checklist) {
          if (item.category !== lastCategory) {
            console.log(chalk.bold(`  ${item.category.toUpperCase()}`));
            lastCategory = item.category;
          }
          const prio = item.priority === 'required'
            ? chalk.red('REQ')
            : item.priority === 'recommended'
              ? chalk.yellow('REC')
              : chalk.gray('OPT');
          console.log(`    [${prio}] ${item.item}`);
          console.log(chalk.gray(`          ${item.rationale}`));
        }
        console.log();
      }
    } catch (error) {
      handleError(error);
    }
  });

// ---- Command: rehearse ----

program
  .command('rehearse')
  .description('Generate a spaced-practice rehearsal schedule')
  .requiredOption('--event-date <YYYY-MM-DD>', 'Event date')
  .requiredOption('--duration <minutes>', 'Talk duration in minutes')
  .option('--live-coding', 'Include failure drill sessions', false)
  .option('--json', 'Output as JSON', false)
  .action((options) => {
    try {
      const result = rehearseCommand({
        eventDate: options.eventDate,
        duration: parseInt(options.duration, 10),
        liveCoding: options.liveCoding,
        json: options.json,
      });

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log();
        console.log(chalk.bold(`Rehearsal Plan — ${result.talkDurationMinutes} min talk on ${result.eventDate}`));
        console.log(chalk.gray(`  Total prep time: ${result.totalPrepMinutes} min across ${result.sessions.length} sessions`));
        console.log();

        for (const s of result.sessions) {
          const typeColor = s.type === 'build' ? chalk.blue : s.type === 'practice' ? chalk.green : chalk.magenta;
          console.log(`  ${s.date}  ${typeColor(s.type.padEnd(9))} ${s.activity} (${s.durationMinutes} min)`);
          console.log(chalk.gray(`            ${s.description}`));
        }

        for (const w of result.warnings) {
          console.log();
          console.log(chalk.yellow(`  Warning: ${w}`));
        }
        console.log();
      }
    } catch (error) {
      handleError(error);
    }
  });

// ---- Uniform error handler ----

function handleError(error: unknown): never {
  if (error instanceof AppError) {
    console.error(chalk.red(`Error [${error.code}]: ${error.message}`));
    if (error.context) {
      console.error(chalk.gray(`Details: ${JSON.stringify(error.context)}`));
    }
  } else if (error instanceof Error) {
    console.error(chalk.red(`Error: ${error.message}`));
  } else {
    console.error(chalk.red('An unknown error occurred'));
  }
  process.exit(1);
}

program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}
