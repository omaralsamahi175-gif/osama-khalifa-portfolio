import { Dot } from "./ui/Dot"

export function Footer() {
  return (
    <footer className="osk-footer">
      <span>
        FRONT TO BACK · ONE ENGINEER
        <br />
        SHIPPED, NOT STAGED
      </span>
      <span>
        OSK-01 / 02 / 03 / 04 <b>[04/04]</b>
      </span>
      <span>
        © {new Date().getFullYear()} OSAMA KHALIFA
        <br />
        CAIRO, EGYPT <Dot />
      </span>
    </footer>
  )
}
