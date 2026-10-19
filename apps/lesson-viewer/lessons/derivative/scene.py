from manim import *

config.background_color = '#101820'

class Derivative(Scene):
    def construct(self):
        title = Text('From an average rate to an instant', font_size=32).to_edge(UP)
        axes = Axes(x_range=[0, 4, 1], y_range=[0, 10, 2], x_length=7, y_length=4.3, tips=False).shift(LEFT * 1.6 + DOWN * .35)
        graph = axes.plot(lambda x: x*x, x_range=[0, 3.1], color=BLUE_C)
        equation = MathTypst('f(x) = x^2', font_size=34).move_to(RIGHT*3.8+UP*1.8)
        h = ValueTracker(1)
        a = Dot(axes.c2p(2,4), color=YELLOW)
        b = always_redraw(lambda: Dot(axes.c2p(2+h.get_value(), (2+h.get_value())**2), color=TEAL_C))
        secant = always_redraw(lambda: axes.plot(lambda x: 4+(4+h.get_value())*(x-2), x_range=[1.3,3.05], color=YELLOW))
        h_label = Text('Distance h', font_size=23).move_to(RIGHT*3.8+UP*.9)
        h_value = DecimalNumber(1, num_decimal_places=2,mob_class=Text, font_size=35).next_to(h_label,DOWN)
        h_value.add_updater(lambda m: m.set_value(h.get_value()))
        slope_label = Text('Secant slope',font_size=23).move_to(RIGHT*3.8+DOWN*.4)
        slope_value = DecimalNumber(5,num_decimal_places=2,mob_class=Text,font_size=35,color=YELLOW).next_to(slope_label,DOWN)
        slope_value.add_updater(lambda m: m.set_value(4+h.get_value()))
        formula = MathTypst('frac(f(2+h)-f(2),h) = 4+h',font_size=30).to_edge(DOWN)
        self.play(Write(title),Create(axes),Write(equation),run_time=1.5)
        self.play(Create(graph),FadeIn(a),FadeIn(b),Create(secant),run_time=1.5)
        self.play(FadeIn(h_label),FadeIn(h_value),FadeIn(slope_label),FadeIn(slope_value),Write(formula),run_time=1)
        self.wait(2)
        self.play(h.animate.set_value(.5),run_time=2)
        self.wait(1)
        self.play(h.animate.set_value(.1),run_time=2)
        self.wait(1)
        self.play(h.animate.set_value(.01),run_time=2)
        self.wait(1)
        conclusion = MathTypst("f'(2) = lim_(h -> 0) (4+h) = 4",font_size=30).to_edge(DOWN)
        self.play(ReplacementTransform(formula,conclusion),run_time=1)
        self.wait(3)
