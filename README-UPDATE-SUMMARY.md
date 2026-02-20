# ✅ README.md 업데이트 완료

**날짜**: 2026-02-20
**상태**: ✅ 완료

## 변경 사항 요약

### 제거된 내용
1. ✅ 다른 CLI 툴에 대한 참조 (OpenCode, Codex-CLI, Gemini-CLI)
2. ✅ "Supported CLI Tools" 테이블 전체 제거
3. ✅ 향후 통합 계획에 대한 모든 언급
4. ✅ 다른 CLI를 위한 adapter stub 참조
5. ✅ 다른 툴을 위한 enable/disable 명령어 예시

### 수정된 내용

#### 1. 헤더 섹션
**이전**:
```markdown
> **Text-to-speech plugin for AI CLI tools (Claude Code, OpenCode, Codex-CLI, Gemini-CLI)**
```

**현재**:
```markdown
> **Text-to-speech plugin for Claude Code**
```

#### 2. 개요 섹션
**제거됨**:
- Supported CLI Tools 테이블
- Tool별 통합 상태

#### 3. 설치 섹션
**수정됨**:
```bash
# 이전
claude plugin install agent-speech-plugin

# 현재
claude plugin install agent-speech
```

#### 4. CLI 명령어 섹션
**수정됨**:
```bash
# 이전
agent-speech enable opencode  # Enable for opencode

# 현재
agent-speech enable           # Enable for Claude Code
```

#### 5. 구성 예시
**수정됨**:
```json
{
  "enabled": true,
  "voice": "Samantha",
  "rate": 200,
  "volume": 50,
  "minLength": 10,
  "filterSensitive": false
  // tools 섹션 제거됨
}
```

#### 6. 프로젝트 구조
**수정됨**:
```
src/adapters/
├── claude-code.ts # Claude Code adapter (MCP)
└── registry.ts    # Adapter registry
// opencode.ts, codex-cli.ts, gemini-cli.ts 제거됨
```

#### 7. 버전 번호
**수정됨**:
```markdown
**Version**: 0.2.0  (0.1.0 → 0.2.0)
```

## 검증 결과

✅ **헤더**: Claude Code 전용으로 명시
✅ **CLI 툴 테이블**: 완전히 제거
✅ **다른 CLI 참조**: 없음
✅ **버전**: 0.2.0으로 업데이트
✅ **명령어 예시**: Claude Code만 참조

## 영향

### 긍정적
- ✅ 문서가 더 명확하고 집중됨
- ✅ 사용자 혼란 감소
- ✅ 유지보수 부하 감소

### 주의사항
- 이 플러그인은 **오직 Claude Code만** 지원
- 다른 CLI 툴에 대한 지원 계획 없음
- 향후에도 Claude Code 전용으로 유지

## 관련 파일

- `README.md` - 주요 변경사항
- `.claude-plugin/agent-speech/plugin.json` - 이미 Claude Code 전용
- `package.json` - 이미 Claude Code 관련 키워드만

---

**결과**: ✅ README.md가 Claude Code 전용 플러그인으로 정확하게 문서화됨
